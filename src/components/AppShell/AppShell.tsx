'use client'

import { AppShell, Burger, Group } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import Image from 'next/image'
import { ButtonColorSchema, SidebarNav } from '@/components'

export function App({ children }: { children: React.ReactNode }) {
	const [opened, { toggle }] = useDisclosure()

	return (
		<AppShell
			header={{ height: 60 }}
			navbar={{ width: 200, breakpoint: 'md', collapsed: { mobile: !opened } }}
			padding={{ base: 'xs', sm: 'md' }}
			transitionDuration={700}
			transitionTimingFunction='ease'>
			<AppShell.Header>
				<Group h='100%' justify='space-between' px='md'>
					<Group>
						<Burger opened={opened} onClick={toggle} hiddenFrom='md' size='sm' />
						<Image width={40} height={40} src='/favicon.svg' alt={''} />
					</Group>
					<Group>
						<ButtonColorSchema />
					</Group>
				</Group>
			</AppShell.Header>
			<AppShell.Navbar>
				<SidebarNav toggle={toggle} />
			</AppShell.Navbar>
			<AppShell.Main>{children}</AppShell.Main>
		</AppShell>
	)
}
