import { HttpInterceptor, HttpRequest, HttpHandler, HttpUserEvent, HttpEvent } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { tap } from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        //不需要驗證的API可以在各httpClient用自訂標頭"No-Auth"的方式判斷，
        //由於在後端也會判斷該API權限，這段可加可不加
        // if (req.headers.get('No-Auth') == "True")
        //     return next.handle(req.clone());
        if (localStorage.getItem('userToken') == null) {
            console.log("userToken==null!!");
            return next.handle(request);
        }
        else if (localStorage.getItem('userToken') != null) {
            console.log("userToken!=null!!")
            const clonedReq = request.clone({
                headers: request.headers.set("Authorization", "Bearer " + localStorage.getItem('userToken'))
            });
            return next.handle(clonedReq)
                .pipe(
                    tap(
                        succ=>{},
                        err=>{
                            //有token卻無法通過驗證代表過期或偽造
                            if (err.status === 401){
                                console.log("userToken 401!");
                                this.router.navigateByUrl('/SignIn');
                            }                            
                        }
                    )
                );
        }
        else {
            this.router.navigateByUrl('/SignIn');
        }
    }
}