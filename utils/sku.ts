/**
 * Utility functions for SKU and Barcode Generation
 */

export function generateSKU(categoryName: string, productName: string): string {
    // Take first 3 letters of category, first 3 letters of product, and a random 4 digit number
    const prefix = categoryName.substring(0, 3).toUpperCase();
    const namePart = productName.substring(0, 3).toUpperCase();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();

    return `${prefix}-${namePart}-${randomSuffix}`;
}

export function generateBarcode(sku: string): string {
    // A simplistic EAN-like or Code39 12-digit generator based on timestamp
    // In a real system, you'd use a hashing or sequence logic to ensure EAN-13 standards.
    const timePart = Date.now().toString().slice(-8);
    const randomPart = Math.floor(1000 + Math.random() * 9000).toString();
    return `${timePart}${randomPart}`;
}
