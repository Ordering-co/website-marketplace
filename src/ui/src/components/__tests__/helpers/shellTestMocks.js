export const sessionUserFixture = {
  id: 1,
  name: 'Jane',
  lastname: 'Doe',
  photo: 'avatar.png',
  loyalty_level: { name: 'Gold' }
}

export const customerFixture = {
  id: 2,
  name: 'Alex',
  lastname: 'Customer'
}

export const orderWithAddressFixture = {
  options: {
    type: 1,
    address: { address: '123 Main St', location: { lat: 40.7, lng: -74.0 } },
    address_id: 1,
    moment: null
  },
  carts: {
    'businessId:1': {
      uuid: 'cart-1',
      business_id: 1,
      business: { id: 1, slug: 'demo-store', name: 'Demo Store' },
      products: [{ id: 10, name: 'Burger', code: 'BRG-1', price: 9.5 }]
    }
  }
}

export const walletEnabledConfigs = {
  cash_wallet: { value: '1' },
  wallet_cash_enabled: { value: '1' },
  wallet_credit_point_enabled: { value: '1' },
  platform_store_giftcard_enabled: { value: '1' },
  advanced_offers_module: { value: '1' },
  plan_enterprise: { value: '1' },
  school_module_enabled: { value: '1' },
  preorder_status_enabled: { value: '1' },
  order_types_allowed: { value: '1|2|3' },
  max_days_preorder: { value: '7' }
}
