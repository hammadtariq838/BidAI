import { createFileRoute } from '@tanstack/react-router'
import { Tender } from '@/types/primitive.type'
import { z } from 'zod'
import { BidGenerationOrder } from '@/constants'
import { useGetTenderByIdQuery } from '@/services/tender/tenderApiSlice';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { PopoverClose } from '@radix-ui/react-popover';
import { calculateUpdatedPrice } from '@/lib/utils';
import { Plus, Trash } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ExcelJs from 'exceljs';


const mapTenderToForm = (tenderItem: Tender['items'][number], order: BidGenerationOrder) => {
  const bids = tenderItem.bids.map(bid => bid ?? 0);
  return {
    isChecked: false,
    ref_no: tenderItem.ref_no,
    item: tenderItem.item,
    item_description: tenderItem.item_description,
    item_qnty: tenderItem.item_qnty,
    units: tenderItem.units,
    bid_price: Number(
      (order === 'highest'
        ? bids[bids.length - 1]
        : order === 'lowest'
          ? bids[0]
          : bids.reduce((a, b) => a + b, 0) / bids.length
      ).toFixed(2) || 0
    ),
    escalation_percent: 0,
  }
};

const bidSchema = z.object({
  items: z.array(
    z.object({
      ref_no: z.coerce
        .number()
        .int()
        .positive()
        .step(10),
      item: z.string().min(1),
      item_description: z.string().min(1),
      item_qnty: z.coerce
        .number()
        .positive(),
      units: z.string().min(1),
      bid_price: z
        .number()
        .positive()
        .step(0.01),
      escalation_percent: z
        .number()
        .min(-100)
        .max(100)
        .default(0),
      isChecked: z.boolean().default(false),
    })
  ),
});

function exportToExcel(items: z.infer<typeof bidSchema>['items']) {
  const workbook = new ExcelJs.Workbook();
  const sheet = workbook.addWorksheet('Bid Generation');
  sheet.columns = [
    { header: 'Ref No.', key: 'ref_no', width: 10 },
    { header: 'Item', key: 'item', width: 20 },
    { header: 'Item Description', key: 'item_description', width: 30 },
    { header: 'Item Qty.', key: 'item_qnty', width: 10 },
    { header: 'Units', key: 'units', width: 10 },
    { header: 'Bid Price', key: 'bid_price', width: 15 },
  ];
  items.forEach((item) => {
    sheet.addRow({
      ref_no: item.ref_no,
      item: item.item,
      item_description: item.item_description,
      item_qnty: item.item_qnty,
      units: item.units,
      bid_price: item.bid_price,
    });
  });
  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {
      type:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bid-generation.xlsx';
    a.click();
  });
}

function exportToPDF(items: z.infer<typeof bidSchema>['items']) {
  const doc = new jsPDF();
  const data = items.map((item) => [
    item.ref_no,
    item.item,
    item.item_description,
    item.item_qnty,
    item.units,
    item.bid_price,
  ]);
  autoTable(doc, {
    head: [
      ['Ref No.', 'Item', 'Item Description', 'Item Qty.', 'Units', 'Bid Price'],
    ],
    body: data,
  });
  doc.save('bid-generation.pdf');
}

function exportToCSV(items: z.infer<typeof bidSchema>['items']) {
  const csv = items.map((item) =>
    [
      item.ref_no,
      item.item,
      item.item_description,
      item.item_qnty,
      item.units,
      item.bid_price,
    ].join(',')
  ).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'bid-generation.csv';
  a.click();
}

const Screen = () => {
  const { id, order } = Route.useSearch();
  const { data: tenderData } = useGetTenderByIdQuery({ id });
  const tender = tenderData?.tender;

  const form = useForm<z.infer<typeof bidSchema>>({
    resolver: zodResolver(bidSchema),
  });
  const { reset, watch } = form;

  useEffect(() => {
    const defaultValues = tender ? tender.items.map(item => mapTenderToForm(item, order)) : [];
    reset({ items: defaultValues });
  }, [tender, order, reset]);

  function onSubmit(values: z.infer<typeof bidSchema>) {
    // // Map the form values into the appropriate format
    // const bid = values.items.map(item => ({
    //   ref_no: item.ref_no,
    //   item: item.item,
    //   item_description: item.item_description,
    //   item_qnty: item.item_qnty,
    //   units: item.units,
    //   bid_price: item.bid_price,
    //   escalation_percent: item.escalation_percent,
    // }));
    // // Store the metadata alongside the bid - to be used for future reference
    // const metadata = {
    //   reference_tender: tender?._id,
    //   tender_id: tender?.tender_id,
    //   order,
    // };
    // // Save the bid to the database
    // console.log(bid, metadata);

    console.log('values', values);
    toast.success('Bid generated successfully!');
  }

  function applyEscalationToAllItems(escalationPercent: number) {
    const items = watch('items');
    const updatedItems = items.map(item => ({
      ...item,
      escalation_percent: escalationPercent,
    }));
    form.setValue('items', updatedItems);
    toast.success(`Escalation of ${escalationPercent}% applied to all items!`);
  }


  function addItem(index: number) {
    const items = watch('items');
    const newItems = [
      ...items.slice(0, index),
      {
        ref_no: items[index].ref_no,
        item: '',
        item_description: '',
        item_qnty: 0,
        units: '',
        bid_price: 0,
        escalation_percent: 0,
        isChecked: false,
      },
      ...items.slice(index),
    ].map((item, i) => ({ ...item, ref_no: (i + 1) * 10 }));
    form.setValue('items', newItems);
    toast.success('Item added successfully!');
  }

  const handleExport = (exportType: string) => {
    switch (exportType) {
      case 'excel':
        exportToExcel(form.watch('items'));
        break;
      case 'pdf':
        exportToPDF(form.watch('items'));
        break;
      case 'csv':
        exportToCSV(form.watch('items'));
        break;
      default:
        break;
    }
  };



  return (
    <main className="flex flex-col gap-4 bg-white w-full py-6 px-8">
      <div className="flex gap-2 justify-between w-full">
        <div className='flex items-center gap-4'>
          <Button
            type="button"
            onClick={() => addItem(0)}
          >
            Add Item
          </Button>
          <Select
            onValueChange={(value) => {
              applyEscalationToAllItems(Number(value));
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Apply Escalation" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="0">0%</SelectItem>
                <SelectItem value="5">5%</SelectItem>
                <SelectItem value="10">10%</SelectItem>
                <SelectItem value="20">20%</SelectItem>
                <SelectItem value="30">30%</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className='flex items-center gap-4'>
          {/* <Button type="submit"
            onClick={() => form.handleSubmit(onSubmit)()}
          >Save</Button> */}
          <Select
            onValueChange={(value) => handleExport(value)}
          >
            <SelectTrigger className="w-28">
              <SelectValue placeholder="Export as" />
            </SelectTrigger>
            <SelectContent className="bg-white text-primary">
              <SelectGroup>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="flow-root">
            <div className="relative overflow-y-auto max-h-[450px] rounded-lg border w-max scroll-smooth">
              <FormTable form={form} />
            </div>
          </div>
        </form>
      </Form>
    </main>
  )
}

export default function FormTable({
  form,
}: {
  form: ReturnType<typeof useForm<z.infer<typeof bidSchema>>>;
}) {
  const copyItem = (index: number) => {
    const items = form.watch('items');
    const current_item = { ...items[index], isChecked: false };
    const newItem = { ...current_item };
    const updatedItems = [
      ...items.slice(0, index),
      current_item,
      newItem,
      ...items.slice(index + 1),
    ].map((item, i) => ({ ...item, ref_no: (i + 1) * 10 }));
    form.setValue('items', updatedItems);
    toast.success('Item copied successfully!');
  };

  const deleteItem = (index: number) => {
    const items = form.watch('items');
    const updatedItems = [...items.slice(0, index), ...items.slice(index + 1)].map(
      (item, i) => ({ ...item, ref_no: (i + 1) * 10 })
    );
    form.setValue('items', updatedItems);
    toast.success('Item deleted successfully!');
  };

  return (
    <table
      className="w-[1200px] border-separate border-spacing-0"
      id="bid-generation-table"
    >
      <thead className="bg-[#F9FAFB]">
        <tr>
          <th
            scope="col"
            className="sticky top-0 z-10 border-b border-gray-300 w-5 py-1.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 bg-[#F9FAFB] sm:pl-6 lg:pl-8 uppercase"
          >
            <span></span>
          </th>
          {[
            'Ref No.',
            'Item',
            'Item Description',
            'Item Qty.',
            'Units',
            'Reference Price',
            'Bid Price',
            'Escalation %',
          ].map((header, index) => (
            <th
              scope="col"
              className={`sticky top-0 z-10 border-b border-gray-300 py-1.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 bg-[#F9FAFB] sm:pl-6 lg:pl-8 uppercase w-min`}
              key={index}
            >
              <span>{header}</span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        {form.watch('items')?.map((_item, index: number) => {
          const current_item = form.watch(`items.${index}`);
          return (
            <tr
              key={index}
              className={cn('h-12', index % 2 === 1 ? 'bg-brand' : '')}
            >
              <td className="text-sm px-1 text-gray-900 w-5 h-12 flex items-center justify-center mx-auto">
                <Popover open={current_item.isChecked}>
                  <PopoverTrigger />
                  <FormField
                    control={form.control}
                    name={`items.${index}.isChecked`}
                    render={({ field }) => (
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    )}
                  />
                  <PopoverContent
                    className="w-max"
                    align="center"
                    side="left"
                    asChild
                  >
                    <PopoverClose asChild>
                      <div className="items-center bg-red-500 flex max-w-[64px] flex-col py-6 px-5 rounded-xl gap-3">
                        <Plus
                          className="w-6 h-6 text-black cursor-pointer"
                          onClick={() => copyItem(index)}
                        />
                        <Trash
                          className="w-6 h-6 text-red-500 cursor-pointer"
                          onClick={() => deleteItem(index)}
                        />
                      </div>
                    </PopoverClose>
                  </PopoverContent>
                </Popover>
              </td>
              <td className="text-sm px-1 text-gray-900 h-12">
                <Input
                  {...form.register(`items.${index}.ref_no`)}
                  type="number"
                  readOnly
                  className={cn(
                    {
                      'bg-brand': index % 2 === 1,
                    },
                    {
                      'focus-visible:ring-white border-red-500':
                        form.formState.errors.items?.[index]?.ref_no,
                    }
                  )}
                />
              </td>
              <td className="text-sm px-1 text-gray-900 h-12">
                <Input
                  {...form.register(`items.${index}.item`)}
                  className={cn(
                    {
                      'bg-brand': index % 2 === 1,
                    },
                    {
                      'focus-visible:ring-white border-red-500':
                        form.formState.errors.items?.[index]?.item,
                    }
                  )}
                />
              </td>
              <td className="text-sm px-1 text-gray-900 h-12">
                <Input
                  {...form.register(`items.${index}.item_description` as const)}
                  className={cn(
                    {
                      'bg-brand': index % 2 === 1,
                    },
                    {
                      'focus-visible:ring-white border-red-500':
                        form.formState.errors.items?.[index]?.item_description,
                    }
                  )}
                />
              </td>
              <td className="text-sm px-1 text-gray-900 h-12">
                <Input
                  {...form.register(`items.${index}.item_qnty`)}
                  type="number"
                  defaultValue={0}
                  className={cn(
                    {
                      'bg-brand': index % 2 === 1,
                    },
                    {
                      'focus-visible:ring-white border-red-500':
                        form.formState.errors.items?.[index]?.item_qnty,
                    }
                  )}
                />
              </td>
              <td className="text-sm px-1 text-gray-900 h-12">
                <Input
                  {...form.register(`items.${index}.units`)}
                  className={cn(
                    {
                      'bg-brand': index % 2 === 1,
                    },
                    {
                      'focus-visible:ring-white border-red-500':
                        form.formState.errors.items?.[index]?.units,
                    }
                  )}
                />
              </td>
              <td className="text-sm px-1 text-gray-900 h-12">
                <Input
                  {...form.register(`items.${index}.bid_price`)}
                  type="number"
                  step="0.01"
                  defaultValue={0}
                  className={cn(
                    {
                      'bg-brand': index % 2 === 1,
                    },
                    {
                      'focus-visible:ring-white border-red-500':
                        form.formState.errors.items?.[index]?.bid_price,
                    }
                  )}
                />
              </td>
              <td className="text-sm px-1 text-gray-900 h-12">
                <Input
                  type="text"
                  value={calculateUpdatedPrice(
                    current_item.bid_price,
                    current_item.escalation_percent
                  )}
                  readOnly
                  className={cn('border border-gray-300 p-2', {
                    'bg-brand': index % 2 === 1,
                  })}
                />
              </td>
              <td className={`text-sm px-1 text-gray-900 h-12 w-min`}>
                <Input
                  {...form.register(`items.${index}.escalation_percent` as const)}
                  type="number"
                  defaultValue={0}
                  step="0.01"
                  className={cn(
                    {
                      'bg-brand': index % 2 === 1,
                    },
                    {
                      'focus-visible:ring-white border-red-500':
                        form.formState.errors.items?.[index]?.escalation_percent,
                    }
                  )}
                />
              </td>
            </tr>
          )
        }
        )}
      </tbody>
    </table>
  );
}


const SearchSchema = z.object({
  id: z.string(),
  order: z.enum(['highest', 'lowest', 'average']),
})
export const Route = createFileRoute('/_protected/bids/bid-generation')({
  component: Screen,
  validateSearch: SearchSchema
})