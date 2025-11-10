"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useEmployees } from "@/hooks/use-employees";
import { ReadEmployeeDTO } from "@/lib/types";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function EmployeesPage() {
  const { user } = useAuth();
  const { getEmployeesPage } = useEmployees();
  const [employees, setEmployees] = useState<ReadEmployeeDTO[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 9;

  const fetchEmployees = useCallback(
    async (page: number) => {
      try {
        const response = await getEmployeesPage(page, pageSize);
        setEmployees(response.content);
        setTotalPages(response.totalPages);
        setCurrentPage(response.number);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    },
    [getEmployeesPage]
  );

  useEffect(() => {
    fetchEmployees(currentPage);
  }, [currentPage, fetchEmployees]);

  const handlePrevious = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (currentPage > 0) {
        setCurrentPage((p) => p - 1);
      }
    },
    [currentPage]
  );

  const handleNext = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (currentPage < totalPages - 1) {
        setCurrentPage((p) => p + 1);
      }
    },
    [currentPage, totalPages]
  );

  const handlePageClick = useCallback(
    (e: React.MouseEvent, page: number) => {
      e.preventDefault();
      setCurrentPage(page);
    },
    []
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Employees</h1>
        {user?.userRole === "SYSTEM_MANAGER" && (
          <Link href="/dashboard/employees/new">
            <Button>Add Employee</Button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((employee) => (
          <Link key={employee.id} href={`/dashboard/employees/${employee.id}`}>
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="space-y-4">
                <div>
                  <p className="text-xl font-semibold">{employee.fullName}</p>
                  <p className="text-sm text-gray-500">
                    {employee.registrationNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{employee.user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p>{employee.user.userRole}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={handlePrevious}
                aria-disabled={currentPage === 0}
                className={
                  currentPage === 0 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  onClick={(e) => handlePageClick(e, i)}
                  isActive={currentPage === i}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={handleNext}
                aria-disabled={currentPage === totalPages - 1}
                className={
                  currentPage === totalPages - 1
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
