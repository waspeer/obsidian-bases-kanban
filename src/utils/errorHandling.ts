/**
 * Error handling utilities with proper type guards
 */

/**
 * Type guard to check if an unknown value is an Error instance
 * @param error - The value to check
 * @returns True if the value is an Error instance
 */
export function isError(error: unknown): error is Error {
	return error instanceof Error;
}

/**
 * Converts an unknown error value to an Error instance
 * Handles cases where the error might not be an Error object
 * @param error - The error value to convert
 * @returns An Error instance
 */
export function toError(error: unknown): Error {
	if (isError(error)) {
		return error;
	}
	
	if (typeof error === 'string') {
		return new Error(error);
	}
	
	if (error && typeof error === 'object' && 'message' in error) {
		const messageValue = error.message;
		const messageStr = typeof messageValue === 'string' 
			? messageValue 
			: JSON.stringify(messageValue);
		return new Error(messageStr);
	}
	
	// Handle primitive types explicitly to avoid ESLint no-base-to-string
	if (error === null) {
		return new Error('null');
	}
	
	if (error === undefined) {
		return new Error('undefined');
	}
	
	if (typeof error === 'number' || typeof error === 'boolean') {
		return new Error(String(error));
	}
	
	// Handle arrays - String([1,2,3]) = "1,2,3", String([]) = ""
	if (Array.isArray(error)) {
		return new Error(error.length === 0 ? '' : error.join(','));
	}
	
	// Handle objects without message property - String({}) = "[object Object]"
	if (typeof error === 'object') {
		return new Error('[object Object]');
	}
	
	// Fallback for any other type (should never reach here in practice)
	// eslint-disable-next-line @typescript-eslint/no-base-to-string
	return new Error(String(error));
}

/**
 * Creates a standardized error message from an error
 * @param error - The error instance
 * @param context - The context where the error occurred
 * @returns Formatted error message
 */
export function formatErrorMessage(error: Error, context: string): string {
	return `[${context}] ${error.name}: ${error.message}`;
}




