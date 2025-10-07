import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Tabs,
  Tab,
  Rating,
  Tooltip,
} from '@mui/material';
import { 
  Visibility, 
  Delete, 
  CheckCircle, 
  Block,
  Flag,
  Store,
  Star
} from '@mui/icons-material';

interface ReportedContent {
  _id: string;
  type: 'shop' | 'review';
  contentId: string;
  reportedBy: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
  content?: any;
}

const ContentModeration = () => {
  const [reports, setReports] = useState<ReportedContent[]>([]);
  const [selectedReport, setSelectedReport] = useState<ReportedContent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [actionNote, setActionNote] = useState('');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    // Mock data - replace with actual API call
    const mockReports: ReportedContent[] = [
      {
        _id: '1',
        type: 'shop',
        contentId: 'shop1',
        reportedBy: 'user1',
        reason: 'Inappropriate content',
        status: 'pending',
        createdAt: new Date().toISOString(),
        content: {
          name: 'Sample Shop',
          description: 'Shop description here...',
          owner: 'Shop Owner Name'
        }
      },
      {
        _id: '2',
        type: 'review',
        contentId: 'review1',
        reportedBy: 'user2',
        reason: 'Spam/Fake review',
        status: 'pending',
        createdAt: new Date().toISOString(),
        content: {
          rating: 1,
          comment: 'This is a fake review...',
          reviewer: 'Reviewer Name',
          shopName: 'Target Shop'
        }
      }
    ];
    setReports(mockReports);
  };

  const handleViewDetails = (report: ReportedContent) => {
    setSelectedReport(report);
    setIsDialogOpen(true);
  };

  const handleResolveReport = async (reportId: string, action: 'approve' | 'remove' | 'dismiss') => {
    try {
      // API call to resolve report
      console.log(`Resolving report ${reportId} with action: ${action}`);
      await loadReports();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error resolving report:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'resolved': return 'success';
      case 'dismissed': return 'default';
      default: return 'default';
    }
  };

  const pendingReports = reports.filter(r => r.status === 'pending');
  const resolvedReports = reports.filter(r => r.status !== 'pending');

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Content Moderation
      </Typography>

      <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
        <Tab 
          label={`Pending Reports (${pendingReports.length})`} 
          icon={<Flag />} 
          iconPosition="start"
        />
        <Tab 
          label={`Resolved Reports (${resolvedReports.length})`} 
          icon={<CheckCircle />} 
          iconPosition="start"
        />
      </Tabs>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Content</TableCell>
              <TableCell>Reported By</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(tabValue === 0 ? pendingReports : resolvedReports).map((report) => (
              <TableRow key={report._id}>
                <TableCell>
                  <Chip
                    icon={report.type === 'shop' ? <Store /> : <Star />}
                    label={report.type}
                    size="small"
                    color={report.type === 'shop' ? 'primary' : 'secondary'}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                    {report.type === 'shop' 
                      ? report.content?.name 
                      : `Review for ${report.content?.shopName}`
                    }
                  </Typography>
                </TableCell>
                <TableCell>{report.reportedBy}</TableCell>
                <TableCell>
                  <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                    {report.reason}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={report.status} 
                    color={getStatusColor(report.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(report.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Tooltip title="View Details">
                    <IconButton 
                      onClick={() => handleViewDetails(report)} 
                      color="primary" 
                      size="small"
                    >
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          Report Details - {selectedReport?.type === 'shop' ? 'Shop' : 'Review'}
        </DialogTitle>
        <DialogContent>
          {selectedReport && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Reported By:
                </Typography>
                <Typography>{selectedReport.reportedBy}</Typography>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Reason:
                </Typography>
                <Typography>{selectedReport.reason}</Typography>
              </Box>

              {selectedReport.type === 'shop' ? (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Shop Details:
                  </Typography>
                  <Typography><strong>Name:</strong> {selectedReport.content?.name}</Typography>
                  <Typography><strong>Owner:</strong> {selectedReport.content?.owner}</Typography>
                  <Typography><strong>Description:</strong> {selectedReport.content?.description}</Typography>
                </Box>
              ) : (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Review Details:
                  </Typography>
                  <Typography><strong>Shop:</strong> {selectedReport.content?.shopName}</Typography>
                  <Typography><strong>Reviewer:</strong> {selectedReport.content?.reviewer}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <strong>Rating:</strong>
                    <Rating value={selectedReport.content?.rating} readOnly size="small" />
                  </Box>
                  <Typography><strong>Comment:</strong> {selectedReport.content?.comment}</Typography>
                </Box>
              )}

              {selectedReport.status === 'pending' && (
                <TextField
                  label="Action Note (Optional)"
                  multiline
                  rows={3}
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  fullWidth
                />
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>
            Close
          </Button>
          {selectedReport?.status === 'pending' && (
            <>
              <Button 
                onClick={() => handleResolveReport(selectedReport._id, 'dismiss')}
                color="inherit"
              >
                Dismiss
              </Button>
              <Button 
                onClick={() => handleResolveReport(selectedReport._id, 'approve')}
                color="success"
                variant="contained"
              >
                Approve Content
              </Button>
              <Button 
                onClick={() => handleResolveReport(selectedReport._id, 'remove')}
                color="error"
                variant="contained"
              >
                Remove Content
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ContentModeration;