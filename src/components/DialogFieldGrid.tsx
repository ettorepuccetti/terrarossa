import { Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

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
      <Grid xs={4} display={"flex"} flexDirection={"column"} gap={gap}>
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
      <Grid xs={8} display={"flex"} flexDirection={"column"} gap={gap}>
        {labelValues.map((labelValue) => (
          <Typography
            key={labelValue.value}
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
