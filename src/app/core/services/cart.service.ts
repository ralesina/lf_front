import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Producto } from '@shared/models/producto.model';


@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: any[] = [];
  private comercio: any = null;
  private cartSubject = new BehaviorSubject<any[]>([]);

  cart$ = this.cartSubject.asObservable();



  addItem(item: any, comercio: any) {
    if (this.comercio && this.comercio.id_comercio !== comercio.id_comercio) {
      throw new Error('No puedes añadir productos de diferentes comercios. Finaliza o vacía tu pedido actual primero.');
    }

    const existingItem = this.items.find(i => i.id_producto === item.id_producto);
    if (existingItem) {
      if (existingItem.cantidad + item.cantidad > item.stock) {
        throw new Error('No hay suficiente stock disponible');
      }
      existingItem.cantidad += item.cantidad;
    } else {
      if (item.cantidad > item.stock) {
        throw new Error('No hay suficiente stock disponible');
      }
      this.items.push(item);
    }

    if (!this.comercio) {
      this.comercio = comercio;
    }

    this.cartSubject.next([...this.items]);
    this.saveToLocalStorage();
  }

  getItems(): any[] {
    return [...this.items];
  }

  getComercio(): any {
    return this.comercio;
  }

  clearCart() {
    this.items = [];
    this.comercio = null;
    this.cartSubject.next([]);
    localStorage.removeItem('cart');
    localStorage.removeItem('comercio');
  }

  private saveToLocalStorage() {
    try {
      localStorage.setItem('cart', JSON.stringify(this.items));
      localStorage.setItem('comercio', JSON.stringify(this.comercio));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  loadFromLocalStorage() {
    const cartItems = localStorage.getItem('cart');
    const comercioData = localStorage.getItem('comercio');

    if (cartItems) this.items = JSON.parse(cartItems);
    if (comercioData) this.comercio = JSON.parse(comercioData);

    this.cartSubject.next([...this.items]);
  }
}
