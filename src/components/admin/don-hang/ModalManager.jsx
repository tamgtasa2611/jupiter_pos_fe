import { useState, useCallback } from "react";

const ModalManager = () => {
  const [menuDrawerOpen, setMenuDrawerOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleShowOrderDetails = useCallback((record) => {
    setSelectedOrder(record);
    setIsDetailsModalVisible(true);
  }, []);

  const handleExport = useCallback((type) => {
    console.log(`Exporting as ${type}`);
  }, []);

  return {
    menuDrawerOpen,
    setMenuDrawerOpen,
    filterDrawerOpen,
    setFilterDrawerOpen,
    isDetailsModalVisible,
    setIsDetailsModalVisible,
    selectedOrder,
    handleShowOrderDetails,
    handleExport,
  };
};

export default ModalManager;
