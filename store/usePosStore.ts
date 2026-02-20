import { create } from "zustand";

export interface CartItem {
    id: string; // Internal id (can be temp or product Id)
    productId: string;
    name: string;
    sku: string;
    price: number;
    purchasePrice: number;
    quantity: number;
    variantId?: string;
    stock: number;
}

interface PosState {
    cart: CartItem[];
    discount: number; // in percentage or fixed amount later
    tax: number; // percentage
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    setDiscount: (discount: number) => void;
    setTax: (tax: number) => void;
    clearCart: () => void;
    getTotals: () => {
        subtotal: number;
        taxAmount: number;
        discountAmount: number;
        total: number;
        totalPurchasePrice: number;
    };
}

export const usePosStore = create<PosState>((set, get) => ({
    cart: [],
    discount: 0,
    tax: 0,
    addToCart: (item) =>
        set((state) => {
            const existing = state.cart.find((i) => i.id === item.id);
            if (existing) {
                return {
                    cart: state.cart.map((i) =>
                        i.id === item.id
                            ? { ...i, quantity: i.quantity + item.quantity }
                            : i,
                    ),
                };
            }
            return { cart: [...state.cart, item] };
        }),
    removeFromCart: (id) =>
        set((state) => ({ cart: state.cart.filter((i) => i.id !== id) })),
    updateQuantity: (id, quantity) =>
        set((state) => ({
            cart: state.cart.map((i) => (i.id === id ? { ...i, quantity } : i)),
        })),
    setDiscount: (discount) => set({ discount }),
    setTax: (tax) => set({ tax }),
    clearCart: () => set({ cart: [], discount: 0, tax: 0 }),
    getTotals: () => {
        const { cart, discount, tax } = get();
        const subtotal = cart.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0,
        );
        const totalPurchasePrice = cart.reduce(
            (sum, item) => sum + item.purchasePrice * item.quantity,
            0,
        );
        const discountAmount = discount; // assuming fixed for now, can implement percentage check
        const taxedSubtotal = subtotal - discountAmount;
        const taxAmount = (taxedSubtotal * tax) / 100;
        const total = taxedSubtotal + taxAmount;
        return {
            subtotal,
            taxAmount,
            discountAmount,
            total,
            totalPurchasePrice,
        };
    },
}));
