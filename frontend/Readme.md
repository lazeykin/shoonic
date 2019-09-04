Run dev environment `ng serve` or `npm start`

To use proxy for dev, create file `frontend/proxy.conf.json` with the following content
    {
      "/api": {
        "target": "https://shoonic.dev.tseh20.com",
        "secure": false,
        "changeOrigin": true,
        "logLevel": "debug"
      }
    }
Run `npm run start_with_proxy` or `ng serve --proxy-config ./proxy.conf.json`

Build `npm run build:ssr`
Serve `npm run serve:ssr`

Refactoring
===========

Styles
------
    Remove global .css
    Use component specific styles
    Migrate to sass/less
    Retina assets


Code
----
    restructure
    reassable main page
    rewrite using nested routes
    data models for every api method
    
SubModule structure
    components - module specific presentational components
    my_awesome_page - page/controller

Important services (to implement)
    global alerts
    modal dialogs (with customizable title, text, buttons...)
    ...

Project structure 
    app
        components - generic presentational components
        pipes - angular template pipes
        services - global services, like api workers, notifications, responsible for data fetching...
        models - data models
        blocks - smart blocks, controllers specific for some block
            header - header component, cause it's not only presentation, and used on almost every page
            footer
            popup
        pages - page controllers; components, controllers specific for some page
            landing - landing page (now home)
            auth - login and registration stuff
            dashboard - all pages for auth user
                settings
                    personal, brands, saved prepacks
                catalog
                    public, private (my catalog)
                product
                    view, preview, edit
                order
                cart
                messenger
                    contacts, by products, by orders, thread view
                ...


Project structure 
----

    app
        _directives - reusable components such as header, footer, alert component (refactoring move this components to 
        blocks folder)
        _guards - contain auth guard
        _helpers - contain interceptors
        _models - data models
        _services - global services
        _components - reusable components
            dashboard - filters, modals
            form - all components for reactive forms
        dashboard - view all pages for auth users
            buyer - all pages for bayer
            seller - all pages for seller
            messenger - all messenger pages and components
            token - specific page for getting token
            web-shop - contain all web-shop pages and components
         events - specific class for description pagination events
         home - landing
         login  - pages for login
         pipes - contain all pipes
         register - pages for register and components (register header)
         sass_inc - global sass variables
         app.components.ts - main component
         app.modules.ts - file of ngModule ( all declarations, providers, imports)
         app-routing.module.ts - all projects routs
         
Every component contains template(html), style (css or sass), component.spec.ts (tests),
component.ts (logic)
          
