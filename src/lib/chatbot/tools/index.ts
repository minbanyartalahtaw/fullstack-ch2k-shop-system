import { getCurrentDateTime } from "./datetime";
import { calculate } from "./calculate";
import {
  getInvoiceDetails,
  getOrderInvoice,
  getInvoiceDetailsWithDateRange,
} from "./invoice";
import { getAllProductTypeDetails } from "./product";
import { getAssistantCapabilities } from "./capabilities";
import { getTotalPriceWithDate } from "./price";

export const chatTools = {
  getCurrentDateTime,
  calculate,
  getInvoiceDetails,
  getOrderInvoice,
  getInvoiceDetailsWithDateRange,
  getAllProductTypeDetails,
  getAssistantCapabilities,
  getTotalPriceWithDate,
};
