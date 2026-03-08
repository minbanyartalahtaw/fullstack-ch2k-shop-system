import { getCurrentDateTime } from "./datetime";
import { calculate } from "./calculate";
import {
  getInvoiceDetails,
  getAllOrderInvoice,
  getInvoiceWithDateRange,
  getInvoiceWithOrderPending,
  getInvoiceWithOrderCompleted,
} from "./invoice";
import { analyzeProductSales, getAllProductTypeDetails } from "./product";
import { getAssistantCapabilities } from "./capabilities";
import { getTotalPriceAndInvoiceCountWithDate } from "./price";

export const chatTools = {
  getCurrentDateTime,
  calculate,
  getInvoiceDetails,
  getAllOrderInvoice,
  getInvoiceWithDateRange,
  getAllProductTypeDetails,
  getAssistantCapabilities,
  getTotalPriceAndInvoiceCountWithDate,
  analyzeProductSales,
  getInvoiceWithOrderPending,
  getInvoiceWithOrderCompleted,
};
