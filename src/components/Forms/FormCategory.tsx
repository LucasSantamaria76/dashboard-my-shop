'use client';

import { addNewCategorySupabase } from '@/db';
import { useShopStore } from '@/store/shopStore';
import { Button, Flex, Group, Select, Stack, TextInput, Textarea, Tooltip } from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';

type PropsForm = {
  close: () => void;
};

export const FormCategory = ({ close }: PropsForm) => {
  const addNewCategory = useShopStore.use.addNewCategory();

  const { key, getInputProps, onSubmit } = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
      description: ''
    },

    validate: {
      name: isNotEmpty('El nombre de la categoría es requerido')
    }
  });

  return (
    <form
      onSubmit={onSubmit((values) => {
        addNewCategorySupabase(values)
          .then((category_id: string) => {
            addNewCategory({ category_id, ...values });
          })
          .catch((error: any) => {
            console.log(error);
          });
        close();
      })}
    >
      <Stack w={{ base: 250, xs: 450 }}>
        <TextInput
          label="Nombre"
          withAsterisk
          key={key('name')}
          {...getInputProps('name')}
          data-autofocus
        />
        <Textarea label="Descripción" key={key('description')} {...getInputProps('description')} />
        <Group justify="flex-end" m="sm">
          <Button variant="default" onClick={close}>
            Cancelar
          </Button>
          <Button variant="light" color="green" type="submit">
            Guardar
          </Button>
        </Group>
      </Stack>
    </form>
  );
};
