import { getCurrentDateTime } from "./datetime";
import { calculate } from "./calculate";
import {
  getInvoiceDetails,
  getOrderInvoice,
  getInvoiceDetailsWithDateRange,
} from "./invoice";
import { analyzeProductSales, getAllProductTypeDetails } from "./product";
import { getAssistantCapabilities } from "./capabilities";
import { getTotalPriceAndInvoiceCountWithDate } from "./price";

export const chatTools = {
  getCurrentDateTime,
  calculate,
  getInvoiceDetails,
  getOrderInvoice,
  getInvoiceDetailsWithDateRange,
  getAllProductTypeDetails,
  getAssistantCapabilities,
  getTotalPriceAndInvoiceCountWithDate,
  analyzeProductSales,
};
