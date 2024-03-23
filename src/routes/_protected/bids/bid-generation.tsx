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
          // if a or b is null, treat it as 0 for the calculation
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

const Screen = () => {
  const { id, order } = Route.useSearch();
  const { data: tenderData } = useGetTenderByIdQuery({ id });
  const tender = tenderData?.tender;

  console.log('items', tender?.items)

  const form = useForm<z.infer<typeof bidSchema>>({
    resolver: zodResolver(bidSchema),
  });
  const { reset, watch } = form;

  useEffect(() => {
    const defaultValues = tender ? tender.items.map(item => mapTenderToForm(item, order)) : [];
    reset({ items: defaultValues });
  }, [tender, order, reset]);


  console.log('form items', watch('items'));

  function onSubmit(values: z.infer<typeof bidSchema>) {
    console.log('values', values);
    toast.success('Bid generated successfully!');
  }


  return (

    <main className="mx-auto my-3">
      <div className="flex justify-between">
        <h2 className="text-3xl font-bold text-center text-primary">
          Bid Generation
        </h2>

        <div className="flex gap-2">
          <Select
          // onValueChange={(value) => {
          //   applyEscalationToAllItems(Number(value));
          // }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Apply Escalation" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="5">5%</SelectItem>
                <SelectItem value="10">10%</SelectItem>
                <SelectItem value="20">20%</SelectItem>
                <SelectItem value="30">30%</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            type="button"
          // onClick={() => addItem(form.getValues('items').length)}
          >
            Add Item
          </Button>
        </div>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col items-end">
            <div className="mt-8 flow-root">
              <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
                <div className="relative overflow-y-auto h-[450px] mx-8 rounded-lg bg-brand bg-opacity-30">
                  <FormTable form={form} />
                </div>
              </div>
            </div>
          </div>

          <Select
          //  onValueChange={(value) => handleExport(value)}
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
            'Bid Price',
            'Updated Price',
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
                        // onClick={() => copyItem(index)}
                        />
                        <Trash
                          className="w-6 h-6 text-red-500 cursor-pointer"
                        // onClick={() => deleteItem(index)}
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