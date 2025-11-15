
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ParkingLocationsPanel } from "./ParkingLocationsPanel";
import { ParkingRatesPanel } from "./ParkingRatesPanel";

export function AdminDashboard() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Panel de Administración</h1>
          <p className="text-muted-foreground">Gestiona tarifas y ubicaciones de parqueaderos</p>
        </div>
        
        <Tabs defaultValue="locations" className="w-full">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="locations">Ubicaciones</TabsTrigger>
            <TabsTrigger value="rates">Tarifas</TabsTrigger>
          </TabsList>
          <TabsContent value="locations">
            <ParkingLocationsPanel />
          </TabsContent>
          <TabsContent value="rates">
            <ParkingRatesPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
