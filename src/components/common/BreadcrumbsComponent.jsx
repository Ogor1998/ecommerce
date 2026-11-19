import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';



export default function BreadcrumbsComponent({ product }) {
    return (
        <div role="presentation" >
            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" href="/products">
                    Home
                </Link>
                <Link
                    underline="hover"
                    color="inherit"
                    href="/products/shop"
                >
                    Shop
                </Link>
                <Link
                    underline="hover"
                    href={`/products/${product.slug}`}
                    aria-current="page"
                    sx={{
                        color: 'text.primary',
                    }}
                >
                    {product.name}
                </Link>
            </Breadcrumbs>
        </div>
    );
}
