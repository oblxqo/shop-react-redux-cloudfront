import axios, { AxiosError } from "axios";
import React from "react";
import { useQuery, useQueryClient, useMutation } from "react-query";
import API_PATHS from "~/constants/apiPaths";
import { OrderStatus } from "~/constants/order";
import { Order } from "~/models/Order";
import { Response } from "~/models/Response";

export function useOrders() {
  return useQuery<Order[], AxiosError>("orders", async () => {
    const res = await axios.get<Response<Order[]>>(`${API_PATHS.order}/orders`);
    return res.data.payload;
  });
}

export function useInvalidateOrders() {
  const queryClient = useQueryClient();
  return React.useCallback(
    () => queryClient.invalidateQueries("orders", { exact: true }),
    []
  );
}

export function useUpdateOrderStatus() {
  return useMutation(
    (values: { id: string; status: OrderStatus; comment: string }) => {
      const { id, ...data } = values;
      return axios.put(`${API_PATHS.order}/orders/${id}/status`, data, {
        headers: {
          Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
        },
      });
    }
  );
}

export function useSubmitOrder() {
  return useMutation((values: Omit<Order, "id">) => {
    return axios.post<Omit<Order, "id">>(
      `${API_PATHS.cart}/profile/cart/checkout`,
      values,
      {
        headers: {
          Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
        },
      }
    );
  });
}

export function useInvalidateOrder() {
  const queryClient = useQueryClient();
  return React.useCallback(
    (id: string) =>
      queryClient.invalidateQueries(["orders", { id }], { exact: true }),
    []
  );
}

export function useDeleteOrder() {
  return useMutation((id: string) =>
    axios.delete(`${API_PATHS.order}/orders/${id}`, {
      headers: {
        Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
      },
    })
  );
}
