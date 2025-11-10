# Varejo Rápido - Sales Data Viewer

A modern web application built with Next.js and shadcn/ui for viewing daily sales summaries, replacing the manual decryption of old .dat text files.

## Features

- **Sales Data Table**: Display sales data in a clear, organized table format
- **Search Functionality**: Filter sales by customer name or product name with debounced search
- **Responsive Design**: Mobile-friendly interface with horizontal scrolling for tables
- **Real-time Updates**: Refresh button to reload sales data
- **Modern UI**: Built exclusively with shadcn/ui components
- **Performance Optimized**: Debounced search and optimized rendering

## Table Columns

The sales table displays the following information:
- **Data da Venda** (Sale Date)
- **Nome do Cliente** (Customer Name)
- **Nome do Produto** (Product Name)
- **Quantidade** (Quantity)
- **Valor Unitário** (Unit Value)
- **Valor Total** (Total Value)

## Tech Stack

- **Next.js 15.5.4** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **shadcn/ui** - UI component library

## Project Structure

```
src/
├── app/
│   ├── api/vendas/          # Sales API endpoint
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/
│   ├── ui/                  # shadcn/ui components
│   └── custom/              # Custom components
│       ├── sales-table.tsx
│       └── sales-table-skeleton.tsx
├── lib/
│   ├── utils.ts             # shadcn/ui utilities
│   └── formatters.ts        # Formatting utilities
└── types/
    └── sales.ts             # TypeScript types
```

## API Endpoints

### GET /api/vendas

Returns sales data in JSON format:

```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "saleDate": "2024-10-01",
      "customerName": "João Silva",
      "productName": "Smartphone Samsung Galaxy",
      "quantity": 1,
      "unitValue": 1200.00,
      "totalValue": 1200.00
    }
  ],
  "total": 8
}
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development Guidelines

- **Component Library**: Use only shadcn/ui components. No other component libraries are permitted.
- **Custom Components**: Place custom-built components in `src/components/custom/`
- **shadcn/ui Components**: Available in `src/components/ui/`
- **TypeScript**: All components and utilities are fully typed
- **Responsive Design**: All components are mobile-friendly

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Currency and Date Formatting

The application uses Brazilian locale formatting:
- **Currency**: Brazilian Real (BRL) format
- **Dates**: DD/MM/YYYY format
- **Numbers**: Thousand separators with Brazilian convention

## Performance Features

- **Debounced Search**: 300ms delay to prevent excessive API calls
- **Skeleton Loading**: Smooth loading states
- **Error Handling**: Comprehensive error handling with retry functionality
- **Responsive Tables**: Horizontal scrolling on mobile devices
- **Hover Effects**: Visual feedback on table rows
