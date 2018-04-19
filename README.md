# ui-router
Задача данной библиотеки реализовать возможность открытия слоев (страница поверх текущей) на странице при смене урла, но при этом фоновая страница остается без изменений. Пример http://joxi.ru/p27O8wnioGpkP2, страница списка товаров /, поверх нее открывается страница добавления/редактирования товара (слой) /product/:code

### Пример конфига выглядит следующим образом
```javascript
  	{
		products: {
			path: '/',
			exact: true,
			component: ProductListContainer,
			nested: { //вложенные слои
				product: {
					path: '/product/:code',
					exact: true,
					isLayer: true, //true - будет открываться как слой
					layout: ProductEdit //компонент который будет в слое
				},
				productModifier: {
					path: '/product/modifier',
					exact: true,
					isLayer: true,
					layout: ProductModifierContainer
				}
			}
		},

		exportProduct: {
			path: '/products/export',
			exact: true,
			isLayer: true,
			layout: ProductExportContainer
		},
	}
```
  
 ### Пример внедрения
 ```javascript 
  <UIRouter 	defaultLayout={InternalLayout} -- мастер страница
							 routes={routes} - правила для роутинга приложения />
```
