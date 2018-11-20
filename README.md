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
		}
	}
```
  
### Пример внедрения
```javascript
    <UIRouter
        defaultLayout={InternalLayout} - мастер страница
        defaultLayerLayout={DefaultLayerLayout} - Вложенный слайдер страниц
        notFound={NotFound} - слой "не найдено"
        errorBoundary={ErrorBoundary} - DidCatch слой ошибки слоя
        loadingComponent={LoadingComponent} - компонент ожидания загрузки при Lazy loading


        routeWrappers={routeWrappers} - Hoc страницы (можно что нибудь проверить)
	    routes={routes} - правила для роутинга приложения
    />
```

### Поддержка Lazy loading
Установить babel-plugin
`npm install --save-dev @babel/plugin-syntax-dynamic-import`

.babelrc
```sh
{
  "plugins": ["syntax-dynamic-import"]
}
```

/source/...
```javascript
// router.js
import { lazy } from "react";

export const getRoutes = () => ({
    example: {
        path: "/example",
        exact: true,
        component: lazy(() => import("./containers/ExampleContainer")),
        nested: {
            exampleEdit: "/example/edit",
            exact: true,
            isLayer: true,
            layout: lazy(() => import("./containers/ExampleEditContainer"))
        }
    },
});


// AppComponent.js
import React, { Component } from "react";
import { withRouter } from "react-router";
import UIRouter from "modul-ui-router";

@withRouter
export default class AppComponent extends Component {
    render() {
        const { routes } = this.props;

        return (
            <UIRouter
                {/* ... */}

                errorBoundary={ErrorBoundary}
                loadingComponent={LoadingComponent}
            />
        );
    }
}
```

Примеры файлов:
- ErrorBoundary => /srс/ErrorBoundary.js
- LoadingComponent => /srс/LoadingComponent.js