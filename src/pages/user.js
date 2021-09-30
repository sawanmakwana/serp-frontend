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
  TableContainer,
  CardContent,
  Paper,
  Toolbar,
  Divider,
} from '@material-ui/core'

const customers = [
  {
    id: 1,
    createdAt: 1555016400000,
    email: 'trupesh789@gmail.com',
    name: 'Trupesh Chapaneri',
    phone: '123123123',
  },
  {
    id: 2,
    createdAt: 1555016400000,
    email: 'trupesh789@gmail.com',
    name: 'Trupesh Chapaneri',
    phone: '123123123',
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
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography className="tableHeader" variant="h6" id="tableTitle" component="div">
              Users (2)
            </Typography>
            <Button color="primary" variant="contained">
              Add user
            </Button>
          </Box>
        </Box>
        <Box sx={{pt: 3}}>
          <Paper>
            <Card>
              <Toolbar>
                <Typography className="tableHeader" variant="h6" id="tableTitle" component="div">
                  Current page <span> (1)</span>
                </Typography>
              </Toolbar>
              <Divider />
              <CardContent style={{padding: '0'}}>
                <TableContainer>
                  <Table size="medium" className="selectTable">
                    <TableHead>
                      <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
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
                              <Avatar style={{marginRight: 16}}>T</Avatar>
                              <Typography color="textPrimary" variant="body1">
                                {customer.name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>{customer.email}</TableCell>

                          <TableCell>{customer.phone}</TableCell>
                          <TableCell>11</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <TablePagination component="div" count={customers.length} rowsPerPageOptions={[5, 10, 25]} />
              </CardContent>
            </Card>
          </Paper>
        </Box>
      </Container>
    </Box>
  )
}

export {User}
