import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {AppComponent} from "./components/app/app.component";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import * as components from "./components";
import * as vendors from "./vendors";
import * as services from "./services";

const mapImports = (obj: Object) => Object.keys(obj).map(key => obj[key]);

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        ...mapImports(vendors)
    ],
    providers: [
        ...mapImports(services)
    ],
    declarations: [
        ...mapImports(components),
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}