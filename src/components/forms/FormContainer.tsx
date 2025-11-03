import {
  useForm,
  FormProvider,
  FieldValues,
  SubmitHandler,
  Resolver,
  UseFormProps,
} from "react-hook-form";

type TFormProps<T extends FieldValues> = {
  children: React.ReactNode;
  onSubmit: SubmitHandler<T>;
  resolver?: Resolver<T>;
  defaultValues?: UseFormProps<T>["defaultValues"];
};

const FormContainer = <T extends FieldValues = FieldValues>({
  children,
  onSubmit,
  resolver,
  defaultValues,
}: TFormProps<T>) => {
  const methods = useForm<T>({
    resolver,
    defaultValues,
  });

  const { handleSubmit, reset } = methods;

  const submit: SubmitHandler<T> = (data) => {
    onSubmit(data);
    reset();
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        {children}
      </form>
    </FormProvider>
  );
};

export default FormContainer;
