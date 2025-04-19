import { authorizeRole } from '../middlewares/authorization.js';


router.post('/', passportCall('current'), authorizeRole('admin'), productController.createProduct);
router.put('/:pid', passportCall('current'), authorizeRole('admin'), productController.updateProduct);
router.delete('/:pid', passportCall('current'), authorizeRole('admin'), productController.deleteProduct);
