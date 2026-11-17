import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/data-table';
import { getBillingReportColumns } from './columns';
import { generateBillingReport, BillingReportEntry } from '@/lib/billing';

const BillingReportPage: React.FC = () => {
  const [reportData, setReportData] = useState<BillingReportEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        setError(null);
        // In a real application, you would fetch this data from an API
        // For now, we'll use a mock generator
        const data = generateBillingReport(100); // Generate 100 mock entries
        setReportData(data);
      } catch (err) {
        setError('Failed to fetch billing report.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  const downloadCsv = (data: BillingReportEntry[]) => {
    if (data.length === 0) {
      alert('No data to export.');
      return;
    }

    const columns = getBillingReportColumns();
    const header = columns.map(col => typeof col.header === 'string' ? col.header : col.accessorKey).join(',');
    const csvRows = data.map(row =>
      columns.map(col => {
        const value = (row as any)[col.accessorKey as string];
        return `"${String(value).replace(/"/g, '\"')}"`;
      }).join(',')
    );

    const csvContent = [header, ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'billing_report.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <p>Loading billing report...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Billing Report</CardTitle>
          <Button onClick={() => downloadCsv(reportData)}>Export to CSV</Button>
        </CardHeader>
        <CardContent>
          {reportData.length > 0 ? (
            <DataTable columns={getBillingReportColumns()} data={reportData} />
          ) : (
            <p>No billing data available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingReportPage;
