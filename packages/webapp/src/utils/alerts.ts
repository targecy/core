import Swal from 'sweetalert2';

export async function triggerSweetAlert(title: string, icon: 'error' | 'success' | 'warning') {
  await Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 3000,
  }).fire({
    icon,
    title,
    padding: '10px 20px',
  });
}

