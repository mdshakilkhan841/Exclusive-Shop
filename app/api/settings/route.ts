import { NextResponse } from "next/server";

export async function GET() {
    // This would typically come from a DB Settings collection
    // Stubbing for prototype
    return NextResponse.json({
        success: true,
        data: {
            shopName: "Exclusive Super Shop",
            address: "123 Business Avenue, Tech District",
            phone: "+1 234 567 8900",
            email: "hello@exclusiveshop.com",
            taxRate: 5, // 5%
            currency: "USD",
            currencySymbol: "$",
            barcodeType: "CODE128",
            receiptMessage: "Thank you for shopping with us!",
        },
    });
}
