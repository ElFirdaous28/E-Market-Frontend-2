/* eslint-env jest */
import { configureStore } from '@reduxjs/toolkit';
import productReducer, { addSellerProduct } from '../../../store/productSlice';

describe('CreateProduct - Product State Management', () => {
    test('Given ProductForm, When un produit est créé, Then il est ajouté au state (productSlice)', () => {
        // Given: Create Redux store with empty state
        const store = configureStore({
            reducer: {
                product: productReducer
            }
        });

        // Initial state should be empty
        expect(store.getState().product.sellerProducts).toEqual([]);

        // When: A product is created and added to state
        const newProduct = {
            id: 'prod123',
            title: 'iPhone 15 Pro',
            description: 'Latest iPhone model',
            price: 999,
            stock: 10,
            categories: ['cat1', 'cat2'],
            seller_id: 'seller123',
            primaryImage: 'image.jpg',
            secondaryImages: [],
            published: false
        };

        store.dispatch(addSellerProduct(newProduct));

        // Then: Product should be added to Redux state
        const finalState = store.getState().product.sellerProducts;
        expect(finalState).toHaveLength(1);
        expect(finalState[0].title).toBe('iPhone 15 Pro');
        expect(finalState[0].price).toBe(999);
        expect(finalState[0].id).toBe('prod123');
    });
});
