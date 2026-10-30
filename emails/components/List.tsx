import * as React from "react"
import { colors, fonts } from "@/emails/styles"

interface ListProps {
  items: string[]
  paddingLeft?: string
}

export const List = ({ items, paddingLeft = "20px" }: ListProps) => (
  <ul
    style={{
      margin: "12px 0",
      paddingLeft,
      color: colors.text,
      fontFamily: fonts.body,
      fontSize: "14px",
      lineHeight: "22px",
    }}
  >
    {items.map((item, index) => (
      <li key={index} style={{ marginBottom: index < items.length - 1 ? "8px" : "0" }}>
        {item}
      </li>
    ))}
  </ul>
)
