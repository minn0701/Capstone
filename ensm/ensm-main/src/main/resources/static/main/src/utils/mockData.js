// 모킹 데이터 유틸리티
import { getOrInitArrayStorage, getOrInitStorage, setStorage } from './storageHelper';

// API 호출을 모킹하는 헬퍼 함수
export const mockFetch = async (url, options = {}) => {
  // 실제 API 호출 대신 모킹 데이터 반환
  console.log(`[Mock] API 호출: ${options.method || 'GET'} ${url}`);
  
  // 짧은 딜레이 시뮬레이션
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // URL에 따라 다른 모킹 데이터 반환
  if (url.includes('/installed')) {
    return {
      ok: true,
      json: async () => ({ installed: true })
    };
  }
  
  if (url.includes('/current') || url.includes('/system-config')) {
    return {
      ok: true,
      json: async () => ({})
    };
  }
  
  if (url.includes('/packages')) {
    return {
      ok: true,
      json: async () => [
        { id: 'apache', name: 'Apache HTTP Server', installed: 'true', serviceStatus: 'running' },
        { id: 'bind', name: 'BIND DNS Server', installed: 'true', serviceStatus: 'stopped' }
      ]
    };
  }
  
  if (url.includes('/cron/')) {
    return {
      ok: true,
      json: async () => [
        { schedule: '0 0 * * * /usr/bin/backup.sh' },
        { schedule: '*/5 * * * * /usr/bin/check.sh' }
      ]
    };
  }
  
  // 디스크 목록 조회 (공통 함수) - 먼저 정의
  const getDisksList = () => {
    const STORAGE_KEY = 'mock_disks';
    const defaultDisks = [
      { device: '/dev/sda', size: '500G', model: 'Samsung SSD 850', interface: 'SATA' },
      { device: '/dev/sdb', size: '1T', model: 'WD Blue', interface: 'SATA' },
      { device: '/dev/nvme0n1', size: '500G', model: 'Samsung 980 PRO', interface: 'NVMe' },
      { device: '/dev/nvme1n1', size: '1T', model: 'WD Black SN850', interface: 'NVMe' }
    ];
    
    return getOrInitArrayStorage(STORAGE_KEY, defaultDisks);
  };

  // 디스크 관련 API는 더 구체적인 경로를 먼저 확인해야 함
  // /disks/list와 /disks/available을 먼저 확인
  if (url.includes('/disks/list')) {
    const disks = getDisksList();
    console.log('[Mock] 디스크 목록 반환:', disks);
    return {
      ok: true,
      json: async () => disks
    };
  }

  // 사용 가능한 디스크 목록 (파티션, LVM PV, RAID에 사용되지 않은 디스크만)
  if (url.includes('/disks/available')) {
    try {
      const allDisks = getDisksList();
      console.log('[Mock] 전체 디스크 목록:', allDisks.map(d => d.device));
      
      // 사용 중인 디스크 목록 수집
      const usedDevices = new Set();
      
      // 파티션에 사용된 디스크
      const partitions = getOrInitArrayStorage('mock_partitions', []);
      partitions.forEach(p => {
        if (p.disk) {
          usedDevices.add(p.disk);
          console.log(`[Mock] 파티션에서 사용 중인 디스크: ${p.disk} (파티션: ${p.device})`);
        }
      });
      
      // LVM PV에 사용된 디스크
      const pvs = getOrInitArrayStorage('mock_lvm_pv', []);
      pvs.forEach(pv => {
        const device = pv.device || pv.name;
        if (device) {
          usedDevices.add(device);
          console.log(`[Mock] LVM PV에서 사용 중인 디스크: ${device}`);
        }
      });
      
      // RAID에 사용된 디스크
      const raids = getOrInitArrayStorage('mock_raids', []);
      raids.forEach(raid => {
        if (Array.isArray(raid.devices)) {
          raid.devices.forEach(device => {
            if (device) {
              usedDevices.add(device);
              console.log(`[Mock] RAID에서 사용 중인 디스크: ${device}`);
            }
          });
        }
      });
      
      console.log('[Mock] 사용 중인 디스크 목록:', Array.from(usedDevices));
      
      // 사용 가능한 디스크만 필터링
      const availableDisks = allDisks.filter(disk => !usedDevices.has(disk.device));
      console.log('[Mock] 사용 가능한 디스크 목록:', availableDisks.map(d => d.device));
      
      return {
        ok: true,
        json: async () => availableDisks
      };
    } catch (error) {
      console.error('[Mock] 사용 가능한 디스크 목록 조회 실패:', error);
      return {
        ok: true,
        json: async () => []
      };
    }
  }

  // 일반 /disk 경로 (파티션 정보용 - DiskRaidStatus 페이지에서 사용)
  if (url.includes('/disk') && !url.includes('/disks')) {
    return {
      ok: true,
      json: async () => [
        { filesystem: '/dev/sda1', size: '100G', used: '50G', avail: '45G', usePercent: '50%', mounted: '/' }
      ]
    };
  }
  
  if (url.includes('/raid')) {
    return {
      ok: true,
      json: async () => ({ status: 'RAID 정보를 불러올 수 없습니다. (모킹 모드)' })
    };
  }
  
  if (url.includes('/network')) {
    return {
      ok: true,
      json: async () => [
        { name: 'eth0', ip: '192.168.1.100' },
        { name: 'lo', ip: '127.0.0.1' }
      ]
    };
  }
  
  if (url.includes('/network-stats')) {
    return {
      ok: true,
      json: async () => ({
        interfaces: '네트워크 통계 정보 (모킹 모드)',
        connections: '연결 통계 정보 (모킹 모드)',
        routes: '라우팅 정보 (모킹 모드)'
      })
    };
  }
  
  if (url.includes('/network-log')) {
    return {
      ok: true,
      json: async () => ({ log: '네트워크 로그 (모킹 모드)\n로그를 불러올 수 없습니다.' })
    };
  }
  
  if (url.includes('/ports')) {
    return {
      ok: true,
      json: async () => [
        { netid: 'tcp', state: 'LISTEN', local: '0.0.0.0:80', process: 'apache' },
        { netid: 'tcp', state: 'LISTEN', local: '0.0.0.0:443', process: 'apache' }
      ]
    };
  }
  
  if (url.includes('/services')) {
    return {
      ok: true,
      json: async () => [
        { name: 'apache.service', loaded: 'loaded', active: 'active', sub: 'running' },
        { name: 'bind.service', loaded: 'loaded', active: 'inactive', sub: 'dead' }
      ]
    };
  }
  
  if (url.includes('/ddns')) {
    return {
      ok: true,
      json: async () => ({
        enabled: false,
        apiToken: '',
        zoneName: '',
        recordName: '',
        ttl: 120,
        schedule: '*/5 * * * *',
        cronEnabled: false
      })
    };
  }
  
  // 사용자 관리 API 모킹
  if (url.includes('/auth/users')) {
    const STORAGE_KEY = 'mock_users';
    
    // GET: 사용자 목록 조회
    if (options.method === 'GET' || !options.method) {
      const defaultUsers = [
        { username: 'admin' },
        { username: 'user1' }
      ];
      const users = getOrInitArrayStorage(STORAGE_KEY, defaultUsers);
      return {
        ok: true,
        json: async () => users
      };
    }
    
    // POST: 사용자 추가
    if (options.method === 'POST') {
      try {
        const body = JSON.parse(options.body || '{}');
        const defaultUsers = [
          { username: 'admin' },
          { username: 'user1' }
        ];
        const users = getOrInitArrayStorage(STORAGE_KEY, defaultUsers);
        
        // 중복 체크
        if (users.some(u => u.username === body.username)) {
          return {
            ok: false,
            json: async () => ({ error: '이미 존재하는 사용자명입니다.' })
          };
        }
        
        users.push({ username: body.username });
        setStorage(STORAGE_KEY, users);
        
        return {
          ok: true,
          json: async () => ({ message: '사용자가 추가되었습니다.' })
        };
      } catch (error) {
        return {
          ok: false,
          json: async () => ({ error: '사용자 추가에 실패했습니다.' })
        };
      }
    }
    
    // DELETE: 사용자 삭제
    if (options.method === 'DELETE') {
      try {
        const username = url.split('/').pop();
        const defaultUsers = [
          { username: 'admin' },
          { username: 'user1' }
        ];
        const users = getOrInitArrayStorage(STORAGE_KEY, defaultUsers);
        
        const filtered = users.filter(u => u.username !== username);
        setStorage(STORAGE_KEY, filtered);
        
        return {
          ok: true,
          json: async () => ({ message: '사용자가 삭제되었습니다.' })
        };
      } catch (error) {
        return {
          ok: false,
          json: async () => ({ error: '사용자 삭제에 실패했습니다.' })
        };
      }
    }
  }
  
  // RAID 관리 API 모킹
  if (url.includes('/raid')) {
    const STORAGE_KEY = 'mock_raids';
    
    // GET: RAID 목록 조회
    if (url.includes('/raid/list') && (options.method === 'GET' || !options.method)) {
      const raids = getOrInitArrayStorage(STORAGE_KEY, []);
      return {
        ok: true,
        json: async () => raids
      };
    }
    
    // POST: RAID 생성
    if (url.includes('/raid/create') && options.method === 'POST') {
      try {
        const body = JSON.parse(options.body || '{}');
        const raids = getOrInitArrayStorage(STORAGE_KEY, []);
        
        raids.push({
          name: body.name,
          level: body.level,
          devices: body.devices || [],
          spare: body.spare || 0,
          chunkSize: body.chunkSize || 512,
          state: 'active'
        });
        setStorage(STORAGE_KEY, raids);
        
        return {
          ok: true,
          json: async () => ({ message: 'RAID가 생성되었습니다.' })
        };
      } catch (error) {
        return {
          ok: false,
          json: async () => ({ error: 'RAID 생성에 실패했습니다.' })
        };
      }
    }
    
    // DELETE: RAID 삭제
    if (options.method === 'DELETE') {
      try {
        const raidName = url.split('/').pop();
        const raids = getOrInitArrayStorage(STORAGE_KEY, []);
        
        const filtered = raids.filter(r => r.name !== raidName);
        setStorage(STORAGE_KEY, filtered);
        
        return {
          ok: true,
          json: async () => ({ message: 'RAID가 삭제되었습니다.' })
        };
      } catch (error) {
        return {
          ok: false,
          json: async () => ({ error: 'RAID 삭제에 실패했습니다.' })
        };
      }
    }
  }

  // LVM 관리 API 모킹
  if (url.includes('/lvm')) {
    const STORAGE_KEY_PV = 'mock_lvm_pv';
    const STORAGE_KEY_VG = 'mock_lvm_vg';
    const STORAGE_KEY_LV = 'mock_lvm_lv';
    
    // 물리 볼륨 (PV)
    if (url.includes('/lvm/pv')) {
      if (url.includes('/pv/create') && options.method === 'POST') {
        try {
          const body = JSON.parse(options.body || '{}');
          const pvs = getOrInitArrayStorage(STORAGE_KEY_PV, []);
          
          // device가 이미 /dev/ 접두사를 포함하고 있는지 확인
          const device = body.device.startsWith('/dev/') ? body.device : `/dev/${body.device}`;
          
          pvs.push({
            name: device,
            device: device,
            size: '100G',
            vg: ''
          });
          setStorage(STORAGE_KEY_PV, pvs);
          
          return {
            ok: true,
            json: async () => ({ message: '물리 볼륨이 생성되었습니다.' })
          };
        } catch (error) {
          return {
            ok: false,
            json: async () => ({ error: '물리 볼륨 생성에 실패했습니다.' })
          };
        }
      }
      
      if (url.includes('/lvm/pv') && !url.includes('/pv/create')) {
        const pvs = getOrInitArrayStorage(STORAGE_KEY_PV, []);
        return {
          ok: true,
          json: async () => pvs
        };
      }
    }
    
    // 볼륨 그룹 (VG)
    if (url.includes('/lvm/vg')) {
      if (url.includes('/vg/create') && options.method === 'POST') {
        try {
          const body = JSON.parse(options.body || '{}');
          const vgs = getOrInitArrayStorage(STORAGE_KEY_VG, []);
          
          // PV에 VG 할당
          const pvs = getOrInitArrayStorage(STORAGE_KEY_PV, []);
          body.physicalVolumes.forEach(pvName => {
            const pv = pvs.find(p => (p.name || p.device) === pvName);
            if (pv) pv.vg = body.name;
          });
          setStorage(STORAGE_KEY_PV, pvs);
          
          vgs.push({
            name: body.name,
            size: '200G',
            used: '0G',
            free: '200G',
            pvCount: body.physicalVolumes.length
          });
          setStorage(STORAGE_KEY_VG, vgs);
          
          return {
            ok: true,
            json: async () => ({ message: '볼륨 그룹이 생성되었습니다.' })
          };
        } catch (error) {
          return {
            ok: false,
            json: async () => ({ error: '볼륨 그룹 생성에 실패했습니다.' })
          };
        }
      }
      
      if (url.includes('/lvm/vg') && !url.includes('/vg/create')) {
        const vgs = getOrInitArrayStorage(STORAGE_KEY_VG, []);
        return {
          ok: true,
          json: async () => vgs
        };
      }
    }
    
    // 논리 볼륨 (LV)
    if (url.includes('/lvm/lv')) {
      if (url.includes('/lv/create') && options.method === 'POST') {
        try {
          const body = JSON.parse(options.body || '{}');
          const lvs = getOrInitArrayStorage(STORAGE_KEY_LV, []);
          
          lvs.push({
            name: body.name,
            vg: body.volumeGroup,
            size: `${body.size}${body.sizeUnit}`,
            path: `/dev/${body.volumeGroup}/${body.name}`,
            mountPoint: body.mountPoint || ''
          });
          setStorage(STORAGE_KEY_LV, lvs);
          
          return {
            ok: true,
            json: async () => ({ message: '논리 볼륨이 생성되었습니다.' })
          };
        } catch (error) {
          return {
            ok: false,
            json: async () => ({ error: '논리 볼륨 생성에 실패했습니다.' })
          };
        }
      }
      
      if (url.includes('/lv/expand') && options.method === 'POST') {
        try {
          const body = JSON.parse(options.body || '{}');
          const lvs = getOrInitArrayStorage(STORAGE_KEY_LV, []);
          
          const lv = lvs.find(l => (l.name || l.path) === body.logicalVolume);
          if (lv) {
            const currentSize = parseFloat(lv.size);
            const addSize = parseFloat(body.size);
            const unit = body.sizeUnit;
            lv.size = `${currentSize + addSize}${unit}`;
            setStorage(STORAGE_KEY_LV, lvs);
          }
          
          return {
            ok: true,
            json: async () => ({ message: '논리 볼륨이 확장되었습니다.' })
          };
        } catch (error) {
          return {
            ok: false,
            json: async () => ({ error: '논리 볼륨 확장에 실패했습니다.' })
          };
        }
      }
      
      if (url.includes('/lv/shrink') && options.method === 'POST') {
        try {
          const body = JSON.parse(options.body || '{}');
          const lvs = getOrInitArrayStorage(STORAGE_KEY_LV, []);
          
          const lv = lvs.find(l => (l.name || l.path) === body.logicalVolume);
          if (lv) {
            const currentSize = parseFloat(lv.size);
            const shrinkSize = parseFloat(body.size);
            const unit = body.sizeUnit;
            const newSize = Math.max(0.1, currentSize - shrinkSize);
            lv.size = `${newSize}${unit}`;
            setStorage(STORAGE_KEY_LV, lvs);
          }
          
          return {
            ok: true,
            json: async () => ({ message: '논리 볼륨이 축소되었습니다.' })
          };
        } catch (error) {
          return {
            ok: false,
            json: async () => ({ error: '논리 볼륨 축소에 실패했습니다.' })
          };
        }
      }
      
      if (url.includes('/lvm/lv') && !url.includes('/lv/create') && !url.includes('/lv/expand') && !url.includes('/lv/shrink')) {
        const lvs = getOrInitArrayStorage(STORAGE_KEY_LV, []);
        return {
          ok: true,
          json: async () => lvs
        };
      }
    }
    
    // 볼륨 그룹 확장
    if (url.includes('/lvm/vg/expand') && options.method === 'POST') {
      try {
        const body = JSON.parse(options.body || '{}');
        const vgs = getOrInitArrayStorage(STORAGE_KEY_VG, []);
        
        const vg = vgs.find(v => v.name === body.volumeGroup);
        if (vg) {
          vg.pvCount = (vg.pvCount || 0) + body.physicalVolumes.length;
          // PV에 VG 할당
          const pvs = getOrInitArrayStorage(STORAGE_KEY_PV, []);
          body.physicalVolumes.forEach(pvName => {
            const pv = pvs.find(p => (p.name || p.device) === pvName);
            if (pv) pv.vg = body.volumeGroup;
          });
          setStorage(STORAGE_KEY_PV, pvs);
          setStorage(STORAGE_KEY_VG, vgs);
        }
        
        return {
          ok: true,
          json: async () => ({ message: '볼륨 그룹이 확장되었습니다.' })
        };
      } catch (error) {
        return {
          ok: false,
          json: async () => ({ error: '볼륨 그룹 확장에 실패했습니다.' })
        };
      }
    }
  }


  // 파티션 관리 API 모킹
  if (url.includes('/partitions')) {
    const STORAGE_KEY = 'mock_partitions';
    
    // GET: 파티션 목록 조회
    if (url.includes('/partitions/list') && (options.method === 'GET' || !options.method)) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        let partitions = [];
        if (saved) {
          const parsed = JSON.parse(saved);
          partitions = Array.isArray(parsed) ? parsed : [];
        }
        return {
          ok: true,
          json: async () => partitions
        };
      } catch (error) {
        return {
          ok: true,
          json: async () => []
        };
      }
    }
    
    // POST: 파티션 생성
    if (url.includes('/partitions/create') && options.method === 'POST') {
      try {
        const body = JSON.parse(options.body || '{}');
        const partitions = getOrInitArrayStorage(STORAGE_KEY, []);
        
        const partitionNumber = partitions.filter(p => p.disk === body.disk).length + 1;
        // /dev/sda -> /dev/sda1, /dev/nvme0n1 -> /dev/nvme0n1p1
        const device = body.disk.startsWith('/dev/nvme') 
          ? `${body.disk}p${partitionNumber}`
          : `${body.disk}${partitionNumber}`;
        
        partitions.push({
          device: device,
          disk: body.disk,
          size: `${body.size}${body.sizeUnit}`,
          partitionType: body.partitionType || 'primary',
          fileSystem: body.fileSystem || 'ext4',
          mountPoint: ''
        });
        setStorage(STORAGE_KEY, partitions);
        
        return {
          ok: true,
          json: async () => ({ message: '파티션이 생성되었습니다.' })
        };
      } catch (error) {
        return {
          ok: false,
          json: async () => ({ error: '파티션 생성에 실패했습니다.' })
        };
      }
    }
    
    // DELETE: 파티션 삭제
    if (options.method === 'DELETE' && url.includes('/partitions/') && !url.includes('/unmount')) {
      try {
        const partitionDevice = url.split('/partitions/').pop();
        const partitions = getOrInitArrayStorage(STORAGE_KEY, []);
        
        const filtered = partitions.filter(p => p.device !== partitionDevice);
        setStorage(STORAGE_KEY, filtered);
        
        return {
          ok: true,
          json: async () => ({ message: '파티션이 삭제되었습니다.' })
        };
      } catch (error) {
        return {
          ok: false,
          json: async () => ({ error: '파티션 삭제에 실패했습니다.' })
        };
      }
    }
    
    // POST: 파티션 포맷
    if (url.includes('/partitions/format') && options.method === 'POST') {
      try {
        const body = JSON.parse(options.body || '{}');
        const partitions = getOrInitArrayStorage(STORAGE_KEY, []);
        
        const partition = partitions.find(p => p.device === body.partition);
        if (partition) {
          partition.fileSystem = body.fileSystem;
          partition.label = body.label || '';
          partition.mountPoint = ''; // 포맷 시 마운트 해제
          setStorage(STORAGE_KEY, partitions);
        }
        
        return {
          ok: true,
          json: async () => ({ message: '파티션이 포맷되었습니다.' })
        };
      } catch (error) {
        return {
          ok: false,
          json: async () => ({ error: '파티션 포맷에 실패했습니다.' })
        };
      }
    }
    
    // POST: 파티션 마운트
    if (url.includes('/partitions/mount') && options.method === 'POST') {
      try {
        const body = JSON.parse(options.body || '{}');
        const partitions = getOrInitArrayStorage(STORAGE_KEY, []);
        
        const partition = partitions.find(p => p.device === body.partition);
        if (partition) {
          partition.mountPoint = body.mountPoint;
          setStorage(STORAGE_KEY, partitions);
        }
        
        return {
          ok: true,
          json: async () => ({ message: '파티션이 마운트되었습니다.' })
        };
      } catch (error) {
        return {
          ok: false,
          json: async () => ({ error: '파티션 마운트에 실패했습니다.' })
        };
      }
    }
    
    // POST: 파티션 언마운트
    if (url.includes('/partitions/') && url.includes('/unmount') && options.method === 'POST') {
      try {
        const partitionDevice = url.split('/partitions/').pop().replace('/unmount', '');
        const partitions = getOrInitArrayStorage(STORAGE_KEY, []);
        
        const partition = partitions.find(p => p.device === partitionDevice);
        if (partition) {
          partition.mountPoint = '';
          setStorage(STORAGE_KEY, partitions);
        }
        
        return {
          ok: true,
          json: async () => ({ message: '파티션이 언마운트되었습니다.' })
        };
      } catch (error) {
        return {
          ok: false,
          json: async () => ({ error: '파티션 언마운트에 실패했습니다.' })
        };
      }
    }
  }

  // 기본 응답
  return {
    ok: true,
    json: async () => ({ message: '모킹 모드: 실제 API 호출이 비활성화되었습니다.' }),
    text: async () => '모킹 모드: 실제 API 호출이 비활성화되었습니다.'
  };
};

