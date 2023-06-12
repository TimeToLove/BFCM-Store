import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ProductDto } from "@superstore/libs";
import { Router } from "@angular/router";
import { ProductPipe } from "../../../product/product.pipe";
import { ProductService } from "../../../product/product.service";

@Component({
    selector: 'superstore-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit {

    products: ProductDto[] = [];
    @ViewChild('inputSearch', { static: false }) inputSearch!: ElementRef;
    searchBarResult = '';

    constructor(
        private readonly productService: ProductService,
        private readonly router: Router
    ) {
    }

    ngOnInit() {
        this.productService.products
            .subscribe((products) => {
                this.products = products;
            });
    }

    searchProducts($event: Event): void {
        this.searchBarResult = ($event.target as HTMLInputElement).value;
    }

    viewProduct(product: ProductDto): void {
        this.router.navigate(['/product', this.convertProductNameToSlug(product.name)])
            .then(() => this.closeSearchResults());
    }

    convertProductNameToSlug(name: string): string {
        return new ProductPipe().convertProductNameToSlug(name);
    }

    // Keyboard shortcut CTRL + / to focus on searchBarResult input
    @HostListener('window:keydown.control.:', ['$event'])
    focusSearchInput(event: KeyboardEvent): void {
        event.preventDefault();
        this.inputSearch.nativeElement.focus();
    }

    // Keyboard shortcut ESC to clear search bar
    @HostListener('window:keydown.escape', ['$event'])
    closeSearchResults(): void {
        this.searchBarResult = '';
    }
}
