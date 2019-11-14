import {Injectable, Injector, ComponentFactoryResolver, ComponentRef} from '@angular/core';
import {ModalComponent} from './modal.component';
import {ModalOptions} from './modal-options.model';
import {HiNGConfig} from '../hi.config';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import {_throw} from 'rxjs/observable/throw';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class ModalService {

  private instances = [];

  constructor(private hiNGConfig: HiNGConfig,
              private resolver: ComponentFactoryResolver,
              private injector: Injector) {
  }

  open<T>(options: ModalOptions): Observable<any> {
    const rootContainer = options.rootContainer || this.hiNGConfig.rootContainer;
    if (!rootContainer) {
      throw new Error('Should setup ViewContainerRef on modal options or hi config service!');
    }
    if (options.animation === undefined || options.animation === null) {
      options.animation = this.hiNGConfig.modal.animation;
    }
    const componentFactory = this.resolver.resolveComponentFactory(ModalComponent);
    const injector = options.injector || this.injector;
    const modalRef = <ComponentRef<ModalComponent>>rootContainer
      .createComponent(componentFactory, rootContainer.length, injector);
    this.instances.push(modalRef);
    const instance: ModalComponent = modalRef.instance;
    const dismissResult = instance.addContent(options, this.instances.length)
      .do(() => this.close(modalRef))
      .catch(error => {
        this.close(modalRef);
        return _throw(error);
      });
    instance.open();
    return dismissResult;
  }

  closeAll(): void {
    this.instances.forEach(modalRef => this.close(modalRef));
  }

  private close(modalRef: ComponentRef<ModalComponent>): void {
    this.instances.splice(this.instances.indexOf(modalRef), 1);
    const subscriber = modalRef.instance.close()
      .subscribe(_ => {
        subscriber.unsubscribe();
        if (!this.instances.length) {
          modalRef.instance.cleanup();
        }
        modalRef.destroy();
      });
  }
}
