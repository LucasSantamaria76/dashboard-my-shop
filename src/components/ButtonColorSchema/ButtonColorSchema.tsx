import cx from 'clsx'
import { ActionIcon, useMantineColorScheme, useComputedColorScheme, Group } from '@mantine/core'
import { IconMoon, IconSun } from '@tabler/icons-react'
import classes from './ButtonColorSchema.module.css'

export function ButtonColorSchema() {
	const { setColorScheme } = useMantineColorScheme()
	const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true })

	return (
		<Group justify='center'>
			<ActionIcon
				onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
				variant='default'
				size='xl'
				aria-label='Toggle color scheme'>
				<IconSun className={cx(classes.icon, classes.light)} stroke={1} />
				<IconMoon className={cx(classes.icon, classes.dark)} stroke={1} />
			</ActionIcon>
		</Group>
	)
}
