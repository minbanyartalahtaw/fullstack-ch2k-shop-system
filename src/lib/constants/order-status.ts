/** Order status values (matches Prisma OrderStatus enum). Safe for client components. */
export const ORDER_STATUS = {
  NOT_ORDER: "NOT_ORDER",
  ORDER_PENDING: "ORDER_PENDING",
  ORDER_COMPLETED: "ORDER_COMPLETED",
} as const;

export type OrderStatusValue =
  (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];
