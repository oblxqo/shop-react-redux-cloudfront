import axios, { AxiosError } from "axios";
import React from "react";
import { useQuery, useQueryClient, useMutation } from "react-query";
import API_PATHS from "~/constants/apiPaths";
import { Cart, CartItem } from "~/models/CartItem";
import { Response } from "~/models/Response";

export function useCart() {
  return useQuery<CartItem[] | undefined, AxiosError>("cart", async () => {
    try {
      const res = await axios.get<Response<Cart>>(
        `${API_PATHS.cart}/profile/cart`,
        {
          headers: {
            Authorization: `Basic ${localStorage.getItem(
              "authorization_token"
            )}`,
          },
        }
      );
      console.log("In useCart res.data", res.data);
      return res.data.payload.items;
    } catch (err: any) {
      console.log("Error: ", err);
      console.log("Error: ", err?.response?.data);
    }
  });
}

export function useCartData() {
  const queryClient = useQueryClient();
  return queryClient.getQueryData<CartItem[]>("cart");
}

export function useInvalidateCart() {
  const queryClient = useQueryClient();
  return React.useCallback(
    () => queryClient.invalidateQueries("cart", { exact: true }),
    []
  );
}

export function useUpsertCart() {
  return useMutation((values: CartItem) =>
    axios.put<CartItem[]>(`${API_PATHS.cart}/profile/cart`, values, {
      headers: {
        Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
      },
    })
  );
}
