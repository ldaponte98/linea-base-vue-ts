<template>
  <div class="dashboard-page">
    <div class="row mb-4">
      <div class="col-12">
        <div class="card bg-primary text-white border-0 shadow-sm">
          <div class="card-body p-4">
            <div class="row align-items-center">
              <div class="col-md-8">
                <h1 class="h3 mb-2">
                  <i class="bi bi-sun me-2"></i>
                  ¡Bienvenido, {{ user?.name || 'Usuario' }}!
                </h1>
                <p class="mb-0 opacity-75">
                  Aquí tienes un resumen de tu actividad en Infocuenca front
                </p>
              </div>
              <div class="col-md-4 text-end d-none d-md-block">
                <i class="bi bi-speedometer2 display-1 opacity-25"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row mb-4">
      <div class="col-md-4 col-sm-6 mb-3">
        <div class="card border-0 shadow-sm h-100 stats-card">
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col">
                <h6 class="card-title text-muted text-uppercase small">Usuarios</h6>
                <h2 class="h3 mb-0 text-primary">{{ stats.users }}</h2>
                <small class="text-success">
                  <i class="bi bi-arrow-up"></i> +12%
                </small>
              </div>
              <div class="col-auto">
                <div class="rounded-circle bg-primary bg-opacity-10 p-3">
                  <i class="bi bi-people text-primary fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-4 col-sm-6 mb-3">
        <div class="card border-0 shadow-sm h-100 stats-card">
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col">
                <h6 class="card-title text-muted text-uppercase small">Ventas</h6>
                <h2 class="h3 mb-0 text-success">{{ stats.sales }}</h2>
                <small class="text-success">
                  <i class="bi bi-arrow-up"></i> +8.5%
                </small>
              </div>
              <div class="col-auto">
                <div class="rounded-circle bg-success bg-opacity-10 p-3">
                  <i class="bi bi-graph-up text-success fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-4 col-sm-6 mb-3">
        <div class="card border-0 shadow-sm h-100 stats-card">
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col">
                <h6 class="card-title text-muted text-uppercase small">Ingresos</h6>
                <h2 class="h3 mb-0 text-info">$45.2K</h2>
                <small class="text-success">
                  <i class="bi bi-arrow-up"></i> +23%
                </small>
              </div>
              <div class="col-auto">
                <div class="rounded-circle bg-info bg-opacity-10 p-3">
                  <i class="bi bi-currency-dollar text-info fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-transparent">
            <h5 class="card-title mb-0">
              <i class="bi bi-bar-chart me-2"></i>
              Actividad mensual
            </h5>
          </div>
          <div class="card-body">
            <div class="chart-placeholder bg-light rounded d-flex align-items-center justify-content-center" style="height: 300px;">
              <div class="text-center">
                <i class="bi bi-bar-chart display-1 text-muted opacity-25"></i>
                <p class="text-muted mt-2">Aquí iría tu gráfico de Chart.js</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./DashboardPage.ts"></script>
<style lang="scss" src="./DashboardPage.scss" scoped></style>