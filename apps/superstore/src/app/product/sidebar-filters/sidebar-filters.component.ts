import { Component, OnInit } from '@angular/core';
import { filterPrice, ProductDto } from "@superstore/interfaces";
import { ProductService } from "../product.service";

@Component({
    selector: 'superstore-sidebar-filters',
    templateUrl: './sidebar-filters.component.html',
    styleUrls: ['./sidebar-filters.component.scss'],
})
export class SidebarFiltersComponent implements OnInit {
    products: ProductDto[] = [];
    filterPrice: { label: string, name: string, checked: boolean }[] = filterPrice;

    constructor(
        private readonly productService: ProductService
    ) {
    }

    ngOnInit() {
        this.getProducts();
    }

    getProducts() {
        this.productService.products
            .subscribe(products => {
                this.products = products;
            });
    }

    setPriceFilter(label: string) {
        // Uncheck all other price filters
        this.filterPrice.map(f => {
            f.checked = f.label === label;
        });

        this.productService.getProducts(300, 1)
            .subscribe(res => {
                const filteredProducts = res.products.filter(p => {
                    const price = p.price;
                    switch (label) {
                        case 'under-25':
                            return price < 25;
                        case '25-to-50':
                            return price >= 25 && price < 50;
                        case '50-to-100':
                            return price >= 50 && price < 100;
                        case '100-to-200':
                            return price >= 100 && price < 200;
                        case '200-and-above':
                            return price >= 200;
                        default:
                            return true;
                    }
                });
                this.productService.products.next(filteredProducts);
            });
    }
}
