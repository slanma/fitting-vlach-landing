/**
 * Fakturační rozpis s DPH pro administraci (stejně jako na vapesport.cz).
 *
 * Ceny v e-shopu jsou včetně DPH 21 %. Výjimkou je dárkový poukaz: je to
 * víceúčelový poukaz (lze ho uplatnit na různé zboží), u kterého se DPH
 * odvádí až při uplatnění, ne při prodeji — proto má v rozpisu sazbu 0.
 * Zaúčtování ať potvrdí účetní.
 */
import type { OrderRow } from "./db";

export const VAT_RATE = 0.21;

const net = (gross: number, rate: number) => Math.round((gross / (1 + rate)) * 100) / 100;

export type VatLine = {
  name: string;
  detail: string;
  qty: number;
  unitNet: number;
  unitVat: number;
  totalNet: number;
  rate: number;
};

export function vatBreakdown(o: Pick<OrderRow, "items" | "delivery" | "payment" | "total">) {
  const lines: VatLine[] = o.items.map((i) => {
    const rate = i.digital ? 0 : VAT_RATE;
    const unitNet = net(i.unit, rate);
    return {
      name: i.name,
      detail: Object.entries(i.config)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", "),
      qty: i.qty,
      unitNet,
      unitVat: Math.round((i.unit - unitNet) * 100) / 100,
      totalNet: Math.round(unitNet * i.qty * 100) / 100,
      rate,
    };
  });
  const goodsNet = lines.reduce((n, l) => n + l.totalNet, 0);
  const extrasGross = o.delivery.price + o.payment.fee;
  const extrasNet = net(extrasGross, VAT_RATE);
  const subtotalNet = Math.round((goodsNet + extrasNet) * 100) / 100;
  const total = Number(o.total);
  return {
    lines,
    goodsNet: Math.round(goodsNet * 100) / 100,
    extrasLabel: [o.delivery.label, o.payment.label].join(" + "),
    extrasNet,
    vat: Math.round((total - subtotalNet) * 100) / 100,
    total,
  };
}
