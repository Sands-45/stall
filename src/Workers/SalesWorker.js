onmessage = (e) => {
  const sales = e.data.sales;

  const data = sales && {
    sales_turnover: sales
      ?.map((sale) => sale?.total)
      ?.reduce((value, accum) => Number(value) + Number(accum), 0),
    sales_count: sales.length,
    tips_amount:
    sales
    ?.map((sale) => sale?.tip_amount??0)
    ?.reduce((value, accum) => Number(value) + Number(accum), 0),
  sales_count: sales.length,
    refunds_amount: sales
      ?.map((sale) => (sale?.status === "refund" ? sale?.refund_amount : 0))
      ?.reduce((value, accum) => Number(value) + Number(accum), 0),
      refunds_count:sales?.filter((data)=>data?.status ==="refund")?.length,
      net_profit:sales
      ?.map((sale) => sale?.profit)
      ?.reduce((value, accum) => Number(value) + Number(accum), 0),
  };

  //Send Data Back
  postMessage({ stats_data: data ?? null });
};
