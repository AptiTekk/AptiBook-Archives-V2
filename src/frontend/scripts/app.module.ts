import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {AppComponent} from "./page-components/app/app.component";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import * as components from "./components";
import * as pageComponents from "./page-components";
//import * as vendors from "./vendors";
import * as services from "./services";
import {routes} from "./routing/routes";
import * as guards from "./routing/guards";

const mapImports = (obj: Object) => Object.keys(obj).map(key => obj[key]);

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        routes,
        //...mapImports(vendors)
    ],
    providers: [
        ...mapImports(services),
        ...mapImports(guards)
    ],
    declarations: [
        ...mapImports(components),
        ...mapImports(pageComponents)
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}