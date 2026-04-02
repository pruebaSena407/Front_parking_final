
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ParkingLocationsPanel } from "./ParkingLocationsPanel";
import { ParkingRatesPanel } from "./ParkingRatesPanel";
import { UserManagementPanel } from "./UserManagementPanel";

export function AdminDashboard() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Panel de Administración</h1>
          <p className="text-muted-foreground">Gestiona tarifas, ubicaciones y usuarios del sistema</p>
        </div>
        
        <Tabs defaultValue="locations" className="w-full">
          <TabsList className="grid w-full md:w-[600px] grid-cols-3">
            <TabsTrigger value="locations">Ubicaciones</TabsTrigger>
            <TabsTrigger value="rates">Tarifas</TabsTrigger>
            <TabsTrigger value="users">Usuarios</TabsTrigger>
          </TabsList>
          <TabsContent value="locations">
            <ParkingLocationsPanel />
          </TabsContent>
          <TabsContent value="rates">
            <ParkingRatesPanel />
          </TabsContent>
          <TabsContent value="users">
            <UserManagementPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
