
router.post('/:cid/product/:pid', passportCall('current'), authorizeRole('user'), cartController.addProductToCart);
router.post('/:cid/purchase', passportCall('current'), authorizeRole('user'), cartController.purchaseCart);
