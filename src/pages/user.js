import {
  Box,
  Container,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Avatar,
} from '@material-ui/core'
import PerfectScrollbar from 'react-perfect-scrollbar'

const customers = [
  {
    id: 1,
    address: {
      country: 'USA',
      state: 'West Virginia',
      city: 'Parkersburg',
      street: '2849 Fulton Street',
    },
    createdAt: 1555016400000,
    email: 'ekaterina.tankova@devias.io',
    name: 'Ekaterina Tankova',
    phone: '304-428-3097',
  },
  {
    id: 2,
    address: {
      country: 'USA',
      state: 'Bristow',
      city: 'Iowa',
      street: '1865  Pleasant Hill Road',
    },
    createdAt: 1555016400000,
    email: 'cao.yu@devias.io',
    name: 'Cao Yu',
    phone: '712-351-5711',
  },
]

function User() {
  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
      }}
    >
      <Container maxWidth={false} style={{padding: 0}}>
        <Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <Button color="primary" variant="contained">
              Add user
            </Button>
          </Box>
        </Box>
        <Box sx={{pt: 3}}>
          <Card>
            <PerfectScrollbar>
              <Box sx={{minWidth: 1050}}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Registration date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {customers.map(customer => (
                      <TableRow hover key={customer.id}>
                        <TableCell>{customer.id}</TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              alignItems: 'center',
                              display: 'flex',
                            }}
                          >
                            <Avatar style={{marginRight: 16}} />
                            <Typography color="textPrimary" variant="body1">
                              {customer.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>
                          {`${customer.address.city}, ${customer.address.state}, ${customer.address.country}`}
                        </TableCell>
                        <TableCell>{customer.phone}</TableCell>
                        <TableCell>11</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </PerfectScrollbar>
            <TablePagination component="div" count={customers.length} rowsPerPageOptions={[5, 10, 25]} />
          </Card>
        </Box>
      </Container>
    </Box>
  )
}

export {User}
