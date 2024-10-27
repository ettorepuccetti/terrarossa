import { Typography } from "@mui/material";
import { Grid } from "@mui/system";

export default function DialogFieldGrid({
  labelValues,
}: {
  labelValues: {
    label: string;
    value: string | undefined;
    dataTest?: string;
  }[];
}) {
  const gap = "10px";
  return (
    <Grid container spacing={1} width={"100%"} marginBottom={"10px"}>
      <Grid display={"flex"} flexDirection={"column"} gap={gap} size={4}>
        {labelValues.map((labelValue) => (
          <Typography
            key={labelValue.label}
            color={"GrayText"}
            variant={"body1"}
            flexWrap={"nowrap"}
          >
            {labelValue.label}:
          </Typography>
        ))}
      </Grid>
      <Grid display={"flex"} flexDirection={"column"} gap={gap} size={8}>
        {labelValues.map((labelValue, index) => (
          <Typography
            key={index}
            color={"InfoText"}
            data-test={labelValue.dataTest}
          >
            {labelValue.value}
          </Typography>
        ))}
      </Grid>
    </Grid>
  );
}
