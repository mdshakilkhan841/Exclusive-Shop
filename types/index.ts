// Global Enum Types for the system

export enum Role {
    ADMIN = "ADMIN",
    MANAGER = "MANAGER",
    CASHIER = "CASHIER",
}

export enum PaymentMethod {
    CASH = "CASH",
    CARD = "CARD",
    MOBILE_BANKING = "MOBILE_BANKING",
}

export enum SaleStatus {
    COMPLETED = "COMPLETED",
    PARTIAL = "PARTIAL",
    REFUNDED = "REFUNDED",
}

export enum StockType {
    IN = "IN",
    OUT = "OUT",
}

export enum ExpenseCategory {
    RENT = "RENT",
    SALARY = "SALARY",
    UTILITIES = "UTILITIES",
    TRANSPORT = "TRANSPORT",
    OTHER = "OTHER",
}
