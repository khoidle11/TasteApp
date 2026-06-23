export type HealthStatus = {
  service: "tasteapp";
  status: "ok";
};

export function getHealthStatus(): HealthStatus {
  return {
    service: "tasteapp",
    status: "ok"
  };
}
