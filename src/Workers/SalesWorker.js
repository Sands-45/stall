onmessage = (e) => {
  const sales = e.data.sales;

  const data = sales && {
    sales_turnover: sales
      ?.map((sale) => sale?.total)
      ?.reduce((value, accum) => Number(value) + Number(accum), 0),
    sales_count: sales.length,
    average_spend:
      sales
        ?.map((sale) => sale?.total)
        ?.reduce((value, accum) => Number(value) + Number(accum), 0) /
      sales.length,
    refunds_amount: sales
      ?.map((sale) => (sale?.status === "refund" ? sale?.refund_amount : 0))
      ?.reduce((value, accum) => Number(value) + Number(accum), 0),
      refunds_count:sales?.filter((data)=>data?.status ==="refund")?.length
  };

  //Send Data Back
  postMessage({ stats_data: data ?? null });
};
