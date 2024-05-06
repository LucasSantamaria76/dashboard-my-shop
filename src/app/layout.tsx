import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import 'mantine-react-table/styles.css'
import '@mantine/notifications/styles.css'
import '@/globals.css'
import { ColorSchemeScript, MantineProvider } from '@mantine/core'
import { App } from '@/components'
import { theme } from '@/theme'
import { Notifications } from '@mantine/notifications'
import { ModalsProvider } from '@mantine/modals'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Panel My Shop',
	description: 'Panel de administración de My Shop',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='es'>
			<head>
				<ColorSchemeScript />
				{/* <link href="https://cdn.syncfusion.com/ej2/material-dark.css" id="theme" rel="stylesheet" /> */}
				<meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no' />

				<link rel='shortcut icon' href='/favicon.svg' />
			</head>
			<body className={inter.className}>
				<MantineProvider theme={theme} defaultColorScheme='dark'>
					<ModalsProvider>
						<Notifications autoClose={3000} limit={5} />
						<App>{children}</App>
					</ModalsProvider>
				</MantineProvider>
			</body>
		</html>
	)
}
