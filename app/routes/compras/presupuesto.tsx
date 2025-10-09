
import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Space } from "antd";

type MateriaPrimaPresupuesto = {
  nombre: string;
  cantidad: number;
  precioUnitario: number;
};

type PresupuestoCompra = {
  key: number;
  idPresupuesto: string;
  idProveedor: string;
  fecha: string;
  nombreProveedor: string;
  total: number;
  materiasPrimas: MateriaPrimaPresupuesto[];
};

const datosEjemplo: PresupuestoCompra[] = [
  {
